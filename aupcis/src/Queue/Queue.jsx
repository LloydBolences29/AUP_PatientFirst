function QueueNumber1() {
    const QueueNo = [Math.floor(100 + Math.random() * 99999)];
    const userArray = [QueueNo]
    localStorage.setItem('user', JSON.stringify(userArray));
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log(userData);
    return (
        alert("Your Unique Queue Number is " + QueueNo + "CS.")
    )
}
function QueueNumber2() {
    const QueueNo = [Math.floor(100 + Math.random() * 99999)];
    const userArray = [QueueNo]
    localStorage.setItem('user', JSON.stringify(userArray));
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log(userData);
    return (
        alert("Your Unique Queue Number is " + QueueNo + "LA.")
    )
}
function QueueNumber3() {
    const QueueNo = [Math.floor(100 + Math.random() * 99999)];
    const userArray = [QueueNo]
    localStorage.setItem('user', JSON.stringify(userArray));
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log(userData);
    return (
        alert("Your Unique Queue Number is " + QueueNo + "DT.")
    )
}
function QueueNumber4() {
    const QueueNo = [Math.floor(100 + Math.random() * 99999)];
    const userArray = [QueueNo]
    localStorage.setItem('user', JSON.stringify(userArray));
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log(userData);
    return (
        alert("Your Unique Queue Number is " + QueueNo + "PH.")
    )
}
function QueueNumber5() {
    const QueueNo = [Math.floor(100 + Math.random() * 99999)];
    const userArray = [QueueNo]
    localStorage.setItem('user', JSON.stringify(userArray));
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log(userData);
    return (
        alert("Your Unique Queue Number is " + QueueNo + "XR.")
    )
}
export default function Queue() {
    return(
        <>
        <div className="tableEnd">
            <div className="tabularEnd">
                <div id="tableCard">
                    <h1>Cashier</h1>
                    <div id="tableEndBTN">
                        <button className="tableEndBTN1" id="BTNCashier" onClick={QueueNumber1}>Generate Queue Number</button>
                    </div>
                </div>
                <div id="tableCard">
                    <h1>Laboratory</h1>
                    <div id="tableEndBTN">
                        <button className="tableEndBTN1" onClick={QueueNumber2}>Generate Queue Number</button>
                    </div>
                </div>
            </div>
            <div className="tabularEnd">
                <div id="tableCard">
                    <h1>Doctor</h1>
                    <div id="tableEndBTN">
                        <button className="tableEndBTN1" onClick={QueueNumber3}>Generate Queue Number</button>
                    </div>
                </div>
                <div id="tableCard">
                    <h1>Pharmacy</h1>
                    <div id="tableEndBTN">
                        <button className="tableEndBTN1" onClick={QueueNumber4}>Generate Queue Number</button>
                    </div>
                </div>
            </div>
            <div id="tableCard">
                <h1>X-Ray</h1>
                <div id="tableEndBTN">
                    <button className="tableEndBTN1" onClick={QueueNumber5}>Generate Queue Number</button>
                </div>
            </div>
        </div>
        </>
    )
}