import {React, useState }from 'react'
import DatePicker from "react-datepicker";

export default function Billing() {
    const [date, setDate] = useState(new Date());
    return(
        <div>
            <div className="OverallBillHeader">
                <div className="BillingHeader1">
                    <div className="BillingHeader2">
                        <div className="BillingProfilePic">
                            <i class="bi bi-person-circle"></i>
                        </div>
                        <div className="BiilingHeaderInfo1">
                            <h1>Name</h1>
                            <li className="FirstInfoBill">
                                <h5>Sex</h5>
                                <h5>AUP, Silang Cavite</h5>
                                <h5>User Model</h5>
                                <h5>Date</h5>
                                <h5>Church Denomination</h5>
                            </li>
                            <li className="SecondInfoBill">
                                <h4>Balance:</h4>
                                <h4>Last Payment Due:</h4>
                            </li>
                        </div>
                        <div className="BillingHeaderInfo2">
                            <h2 id="ThirdInfoBill1">Billing Information</h2>
                            <li id="ThirdInfoBill2">
                                <h5>Cashier</h5>
                                <h5>Online Banks</h5>
                            </li>
                            <div className="ThirdInfoBillBTN">
                                <button id="ThirdInfoBillBTNs">Upload payment</button>
                                <button id="ThirdInfoBillBTNs1">Edit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h3 id="BillingSentence">"Do not defraud or rob your neighbor. Don not hold back the wages of a hired worker overnight"</h3>
                <h5 id="BillingSentence2">Leviticus 19:13</h5>
            </div>
            <div className="BillHistoryFirstBar5">
                <div className="BillHistoryFirstBar4">
                    <ul className="BillHistoryFirstBar">
                        <div className="BillHistoryFirstBar1">
                            <li id="BillHistory"><h2>Billing History</h2></li>
                            <div className="BillHistoryFirstBar2">
                                <h3>Date:</h3>
                                <div className="DatePicks">
                                    <DatePicker selected={date} onChange={(date) => setDate(date)} />
                                </div>
                            </div>
                        </div>
                    </ul>
                    <div className="BillHistoryFirstBar3">
                        <table className="BillHistoryTable">
                            <th>Date</th>
                            <th>Invoice No.</th>
                            <th>Description</th>
                            <th>Total Cost</th>
                            <th>Status</th>
                            <th>Payment Method</th>
                            <th></th>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}