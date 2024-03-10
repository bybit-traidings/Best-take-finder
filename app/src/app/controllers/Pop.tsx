import React from "react";
import useTo from "./hooks/useTo";
import useWidth from "./hooks/useWidth";



/**
 * 
 * @param props - component props
 * @param props.scene - //url?scene=<nameOfScene>
 * @param props.children - react.component.children 
 * @param props.dark - fore focus to content
 * @param props.top - css for indent from top or "centerFore400" for children hieght 400px
 * @param props.right - css for indent from right or "centerFore400" for children width 400px
 * @param props.bottom - css for indent from bottom or "centerFore400" for children hieght 400px
 * @param props.left - css for indent from left or "centerFore400" for children width 400px
 * @param props.locked - locked if cannot be closed without selecting an option
 * @returns 
 * @example <Pop scene="registrate" top='82' right='center750' dark><Registrate/></Pop>
 */
export default function Pop({scene, children, dark, top, right, left, bottom, locked=false}:{
    scene:string, 
    children:any, 
    dark?: boolean, 
    top?: string, 
    right?: string, 
    left?: string, 
    bottom?: string, 
    locked?: boolean
}){
    const to = useTo({});
    const [vw , vh] = useWidth();

    const { scene: q } = Object.fromEntries(new URLSearchParams(window.location.search))
    const position: any = {};
    const calculatePos = (param, vw, w) => param.includes('center')?`${(vw - (vw > w? w : vw))/2}px`: param;
    if(right) position.right = calculatePos(right, vw, Number(right?.replace('center','')));
    if(left) position.left = calculatePos(left, vw, Number(left?.replace('center','')));
    if(top) position.top = calculatePos(top, vh, Number(top?.replace('center','')));
    if(bottom ) position.bottom = calculatePos(bottom, vh, Number(bottom?.replace('center','')));

    const closeOrOpenPop = ()=>{
        if(window.location.href.includes(scene))
            to(null, {})
        else to(null, {scene})
    }
    const toN = (s) => s? +(s+'').replace('px','').replace('%','').replace('vh','').replace('vw','').replace('em','').replace('rem','') : 0
    

    return(<>
        {q === scene && <div style={{
            position: 'fixed', 
            left: 0,
            top: 0,
            width: '99.99vw', 
            height: '99.99vh', 
            background: dark? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0)',
            zIndex: 99999,
            overflow: 'auto'
        }}
        onClick={() => {if(!locked) closeOrOpenPop()}}
        >
            <div
                style={{
                    position: 'fixed',
                    zIndex: 999999,
                    maxHeight: vh-toN(position.top)-((vh-toN(position.bottom))*Math.sign(toN(position.bottom)))+'px',
                    overflowY: 'auto',
                    ...position
                }}
                onClick={(e)=> e.stopPropagation()}
            >
                <div style={{borderRadius: '8px'}}>
                    {React.cloneElement(children, {...children.props, close: closeOrOpenPop}, children.children)}
                </div>
            </div>
        </div>}
    </>)
}