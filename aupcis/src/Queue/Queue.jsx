import React from "react"
import { useState } from "react";

function Modal({closeModal}) {
    const QueueNo = [Math.floor(1000 + Math.random() * 9999)];
    return (
        <div className="modalBackground">
            <div className="modalContainer">
                <div className="modaltitle">
                    <h2>This is your unique queue number</h2>
                </div>
                <div className="modalbody">
                   <h1>{QueueNo}</h1>
                </div>
                <div className="modalfooter">
                    <button id='modalfooterBTN' onClick={() => closeModal(false)}>Close</button>
                </div>
            </div>
        </div>
    )
}
export default function Queue() {
    const [openModal, setOpenModal] = useState(false);
    return(
        <>
        <div className="tableEnd">
            <div className="tabularEnd">
                <div id="tableCard">
                    <h1>Cashier</h1>
                    <div id="tableEndBTN">
                        <button className="tableEndBTN1" id="BTNCashier" onClick={() => {setOpenModal(true)}}>Generate Queue Number</button>
                    </div>
                </div>
                <div id="tableCard">
                    <h1>Laboratory</h1>
                    <div id="tableEndBTN">
                        <button className="tableEndBTN1" onClick={() => {setOpenModal(true)}}>Generate Queue Number</button>
                    </div>
                </div>
            </div>
            <div className="tabularEnd">
                <div id="tableCard">
                    <h1>Doctor</h1>
                    <div id="tableEndBTN">
                        <button className="tableEndBTN1" onClick={() => {setOpenModal(true)}}>Generate Queue Number</button>
                    </div>
                </div>
                <div id="tableCard">
                    <h1>Pharmacy</h1>
                    <div id="tableEndBTN">
                        <button className="tableEndBTN1" onClick={() => {setOpenModal(true)}}>Generate Queue Number</button>
                    </div>
                </div>
            </div>
            <div id="tableCard">
                <h1>X-Ray</h1>
                <div id="tableEndBTN">
                    <button className="tableEndBTN1" onClick={() => {setOpenModal(true)}}>Generate Queue Number</button>
                </div>
            </div>
        </div>
            {openModal && <Modal closeModal={setOpenModal}/>}
        </>
    )
}