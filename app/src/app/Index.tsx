import React from "react";
import Router from "./controllers/Router"
import Hints from "./controllers/Hints"
import IndexPage from "./components/pages/IndexPage";
import Reverser from "./components/pages/Reverser";
// import { useParams } from "react-router-dom";

export default function Index() {

  
  
  

  return (
    <>
      {/* <Bar exeptions={['/', ...langs.map(l => '/'+l)]}/> */}
      {/* <Bar exeptions={['/']}/> */}
        
      <Router 
        index="/F" 
        toSign='/' 
        roots={{
          '/F': <IndexPage />,
          '/R': <Reverser />
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

