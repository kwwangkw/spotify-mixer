import React from "react"
import "./styles/magicwand.css"


export default function MagicWand() {
    return (
        <div className="flex flex-col items-center font-sans px-8">

            <svg version="1.1" className="clicked fill-current text-dark-gray" id="magicwand" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px"
            width="200px" height="200px" viewBox="0 0 100 100" style={{'enableBackground':'new 0 0 100 100'}}>

                <ellipse id="circle" className="circle" cx="49" cy="47" rx="38.488" ry="40.279"/>

                <path id="wand" className="wand" d="M21.169,68.248c0,0-0.097-1.176,0.54-2.172c0.153-0.258,0.356-0.496,0.608-0.717
                c0.259-0.213,0.552-0.426,0.857-0.662c0.615-0.469,1.308-0.998,2.064-1.572c1.517-1.148,3.286-2.486,5.205-3.891
                c1.924-1.396,3.956-2.916,6.025-4.383c2.075-1.459,4.13-2.947,6.105-4.276c1.957-1.354,3.805-2.588,5.398-3.636
                c1.593-1.047,2.933-1.903,3.878-2.493c0.948-0.584,1.491-0.918,1.491-0.918l0.268,0.353c0,0-0.468,0.433-1.284,1.19
                c-0.822,0.752-2.006,1.814-3.442,3.068c-1.436,1.254-3.121,2.703-4.95,4.227c-1.811,1.545-3.795,3.125-5.757,4.734
                c-1.968,1.601-3.976,3.15-5.837,4.631c-1.867,1.473-3.631,2.816-5.143,3.969c-0.758,0.574-1.453,1.102-2.069,1.568
                c-0.31,0.23-0.592,0.457-0.866,0.648c-0.28,0.184-0.566,0.314-0.855,0.395C22.276,68.656,21.169,68.248,21.169,68.248z"/>

                <path id="star" className="star" d="M62.313,40.123l2.35-4.844l-5.274,1.083l-3.882-3.73l-0.601,5.35L50.16,40.52l4.902,2.224l0.948,5.3
                l3.63-3.976l5.334,0.737L62.313,40.123z"/>

                <polygon id="burst1" className="burst" points="48.566,33.773 42.859,30.462 41.945,32.859 "/>
                <polygon id="burst2" className="burst" points="59.868,23.956 59.525,18.248 62.038,18.477 "/>
                <polygon id="burst3" className="burst" points="71.169,30.005 74.708,25.554 76.306,27.723 "/>
                <polygon id="burst4" className="burst" points="61.353,52.152 59.64,57.517 62.493,57.746 "/>
                <polygon id="burst5" className="burst" points="73.681,42.562 79.616,43.704 78.361,45.874 "/>
            </svg>
            <p className="text-white text-3xl text-center font-light">Hold on tight!</p> 
            <p className="text-white text-3xl text-center font-light">We're working our magic to get you your playlist!</p>
        </div>
    )
}