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
        index="/Best-take-reverser" 
        toSign='/' 
        roots={{
          '/Best-take-finder': <IndexPage />,
          '/Best-take-reverser': <Reverser />
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

