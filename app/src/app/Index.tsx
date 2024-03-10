import React, { useEffect } from "react";
import Router from "./controllers/Router"
import Hints from "./controllers/Hints"
import IndexPage from "./components/pages/IndexPage";
import Bar from "./controllers/Bar";
import { useAppDispatch, useAppSelector } from "../redux/store";
import useTo from "./controllers/hooks/useTo";
// import { useParams } from "react-router-dom";

export default function Index() {
  const to = useTo({});
  // let {lang, ...ps} = useParams();
  const dispatch = useAppDispatch();
  const app = useAppSelector(s=>s.app);

  
  
  

  return (
    <>
      {/* <Bar exeptions={['/', ...langs.map(l => '/'+l)]}/> */}
      {/* <Bar exeptions={['/']}/> */}
        
      <Router 
        index="/Best-take-finder" 
        toSign='/' 
        roots={{
          '/Best-take-finder': <IndexPage />
        }}
        authRoots={{
          // '/news': <News />,
        }}
        auth={true}
        // langs={langs}
      />
      
      <Hints right="0" top="57px" />
    </>
  )
}

