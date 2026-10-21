"use client";

import {useEffect} from "react";
import Link from "next/link";

export default function ErrorPage({error,reset}:{error:Error & {digest?:string};reset:()=>void}){
  useEffect(()=>{console.error("mosque.build page error",error);},[error]);
  return <main className="notFound" role="main">
    <div>
      <span className="brand">mosque.build</span>
      <h1>This page could not be loaded.</h1>
      <p>Your saved project information has not been deleted. Try loading this view again, or return to your project.</p>
      <div className="heroActions">
        <button className="button" type="button" onClick={()=>reset()}>Try again</button>
        <Link className="secondaryButton" href="/my-project">My project</Link>
        <Link className="secondaryButton" href="/">Home</Link>
      </div>
    </div>
  </main>;
}
