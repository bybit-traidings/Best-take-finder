import React, { useEffect, useState } from "react";
import Button from "./Button";
import Switch from '@mui/material/Switch';
import Textarea from "./Textarea";
import useTo from "../../controllers/hooks/useTo";
import { useAppDispatch } from "../../../redux/store";
import { FormControlLabel } from "@mui/material";
import { pink } from '@mui/material/colors';
import { alpha, styled } from '@mui/material/styles';
import { InstructionI, createOrUpdateInstruction, deleteInstruction, getInstructions } from "../../../redux/slices/instructionsSlice";
import Confirm from "../../controllers/Confirm";
import { addHint } from "../../../redux/slices/hintsSlice";


export default function TargetManage(props:{
    instructions: InstructionI[],
    nested?: string[],
}){
    const dispatch = useAppDispatch();
    const to = useTo({});
    const { triger } = Object.fromEntries(new URLSearchParams(window.location.search));
    if(!triger) to(null,{});
    const target = props.instructions.find(el=>el.triger === triger);
    const [form, setForm] = useState<InstructionI | undefined>(target);
    const formKeys =  Object.keys(form||{}).filter(key => !(key.includes('_') || ['updatedAt','createdAt'].includes(key)));
    const [formJson, setFormJson] = useState(JSON.stringify(form||{},null));
    const [isPro, setIsPro] = useState(false);
    const [exitConfirm, setExitConfirm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);


    useEffect(()=>{
        if(!target) dispatch(getInstructions());
    },[]);
    useEffect(()=>{
        if(target && !form) setForm(target);
    })


    const getRows = (str, ml) => str.split('\n').reduce((acc,r)=> acc+Math.ceil(r.length/ml),0)||1;

    
    const closeHandler = () => {
        let result;
        if(!isPro) result = form;
        else result = {...JSON.parse(formJson),  ...(props.nested||[]).reduce((a, k)=>({[k]: JSON.stringify(JSON.parse(formJson)[k])}),{})};
    
        const toPrimitive = (obj) => formKeys.map(k=>obj?.[k]).toString();  
        console.log(result,'\n',target,'\n\n',toPrimitive(result||{}),'\n,\n', toPrimitive(target||{}));
              
        if(toPrimitive(result||{}) === toPrimitive(target||{})) to(null,{});
        else setExitConfirm(true);
    }

    const inputChangeHandler = (e) => {
        if(form && Object.keys(form).includes(e.target.name)){
            // @ts-ignore
            setForm((p)=>({...(p||{}), [e.target.name]: e.target.value}));
        }
    }

    const nestedInputChangeHandler = (e, key) => {
        if(form){
            // @ts-ignore
            setForm(p=>({...p, [key]: JSON.stringify({
                ...(JSON.parse(form?.[key]||'null')|| form?.[key]||{}),
                [e.target.name]: e.target.value
            })}));
        }
    }

    const changeMode = () => {
        if(isPro) {
            try {
                const obj = JSON.parse(formJson);
                setForm({...obj, ...(props.nested||[]).reduce((a, k)=>({...a, [k]:JSON.stringify(obj[k])}),{})});
                setIsPro(p=>!p);
            } catch (error) {
                dispatch(addHint('incorrect JSON!'))
            }
        }else {
            setFormJson((JSON.stringify({...form||{}, ...(props.nested||[]).reduce((a, k)=>({...a, [k]:JSON.parse(form?.[k]||'{}')}),{})}, null, 4)))
            setIsPro(p=>!p);
        }
    }

    const saveHandler = () => {
        let result;
        if(!form) return dispatch(addHint('incorrect JSON!'));
        if(isPro) {
            try {
                const obj = JSON.parse(formJson);
                setForm({...obj, ...(props.nested||[]).reduce((a, k)=>({...a, [k]:JSON.stringify(obj[k])}),{})});
                result = {...obj, ...(props.nested||[]).reduce((a, k)=>({...a, [k]:JSON.stringify(obj[k])}),{})};
            } catch (error) {
                dispatch(addHint('incorrect JSON!'))
            }
        } else result = form;        
        
        if(props.instructions.filter(i=>i.triger===result.triger && i._id !== result._id).length>0) 
            return dispatch(addHint('this Trigger is already in use!'));
        if(result.triger === 'New') return dispatch(addHint('the "Trigger" field cannot have the value "New"'));
        
        dispatch(createOrUpdateInstruction(result));
        to(null,{scene: 'create',triger: result.triger})
        
    }

    const deleteHandler = () => {
        dispatch(deleteInstruction({_id: form?._id}));
        to(null,{})
    }

    
    
    return <>
        <Confirm 
            text='Delete?' 
            subtext='This action cannot be undone in the future.' 
            open={deleteConfirm} 
            setOpen={setDeleteConfirm} action={deleteHandler}
        />
        <Confirm 
            text='Exit?' 
            subtext='If you exit without saving, all changes will be lost.' 
            open={exitConfirm} 
            setOpen={setExitConfirm} action={()=>{to(null, {})}}
        />
        <div style={{position: 'fixed', top:0, left: 0, width: '100vw', height: '100vh'}} onClick={closeHandler} />
        <div 
            style={{
                width: '780px',
                maxWidth: '100vw',
                minHeight: '100vh',
                background: 'radial-gradient(circle, rgba(0,0,0,1) 0, rgba(0,0,0,0.8) 100%)',
                color: 'rgb(250,250,250)',
                padding: '50px',
                position: 'relative',
                borderRadius: '0 0 1rem 1rem '
            }}
            onClick={(e)=>e.stopPropagation()}
        >   
            <div style={{display:'flex', justifyContent:'end'}}> 
                <FormControlLabel 
                    sx={{'& .MuiSwitch-switchBase + .MuiSwitch-track': { '&:hover': {backgroundColor: alpha(pink[600],0.5)},backgroundColor: 'white'}}} 
                    control={<Switch color="secondary" checked={isPro} onChange={changeMode}/>} 
                    label="pro mode" 
                />
            </div>
            {isPro? <div>
                    <div style={{marginBottom: '2rem'}}>
                        <h5>JSON</h5>
                        <Textarea 
                            rows={30}
                            placeholder='prompt' 
                            style={{width: '100%'}} 
                            onChange={(e)=>{setFormJson(e.target.value)}}
                            value={formJson}
                        />
                    </div>
                </div>
                :
                <div>
                    {formKeys.map(key=>
                        (props.nested||[]).includes(key)?
                        <>
                            <h3 style={{marginBottom: '2rem'}}>{key}</h3>
                            {Object.keys(JSON.parse((form?.[key] as any)||'null')|| form?.[key]|| {})
                            .map(nk=><div style={{marginBottom: '2rem'}}>
                                <p>{nk[0].toUpperCase() +nk.slice(1)}</p>
                                <Textarea 
                                    rows={getRows(String((JSON.parse((form?.[key] as any)||'null')|| form?.[key]|| {})?.[nk]),57)}
                                    placeholder={nk} 
                                    style={{width: '100%'}}
                                    name={nk} 
                                    value={(JSON.parse((form?.[key] as any)||'null')|| form?.[key]|| {})?.[nk]}
                                    onChange={(e)=>nestedInputChangeHandler(e, key)}
                                />
                            </div>)}
                        </>
                        :
                        <div style={{marginBottom: '2rem'}}>
                            <h5>{key[0].toUpperCase() +key.slice(1)}</h5>
                            <Textarea 
                                rows={getRows(String(form?.[key]),57)}
                                placeholder={key} 
                                style={{width: '100%'}}
                                name={key} 
                                value={form?.[key]}
                                onChange={inputChangeHandler}
                            />
                        </div>
                    )}
                </div>
            }
            <div style={{display:'flex', flexDirection: 'column', alignItems:'center', gap:'1rem'}}>
                <Button text='Save' width='5.5rem' background='rgb(84, 0, 92)' onClick={saveHandler} />
                {target?._id? <Button text='Delete' width='6.5rem' onClick={()=>setDeleteConfirm(true)} />:''}
            </div>

        </div>
    </>
}

