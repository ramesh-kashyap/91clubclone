
import React, { useState, useEffect } from 'react';


export default function PaymentPage() {
  const [amount, setAmount] = useState(0);
  const [txtUtr, setTxtUtr] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('Patym');

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${process.env.PUBLIC_URL}/assets/css/sach.css`;
  document.head.appendChild(link);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const amountParam = urlParams.get("amount");
    if (amountParam) {
      setAmount(amountParam);
    }
  }, []);

  const handleCopy = () => {
    const textToCopy = document.getElementById('upi_info').innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('UPI COPIED');
    });
  };

  const handlePay = (e) => {
    e.preventDefault();

    if (amount >= 100) {
      if (txtUtr.length === 12) {
        fetch('/api/webapi/manualPayment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            money: amount,
            txt_utr: txtUtr,
            type: selectedMethod,
          }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.status) {
            window.location = '/wallet/recharge';
          } else {
            alert(data.message);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      } else {
        alert('Enter a valid UTR Number');
      }
    } else {
      alert('Deposit amount range: 10.00~10,000.00');
    }
  };

  return (
    <div className="overflow">
      <div className="main" style={{ paddingTop: '0.2rem', backgroundColor: '#fff' }}>
        <div className="money_content">
          <span className="money_title" style={{ fontSize: '18px' }}>UPI Payment Apps</span>
          <div className="money" style={{ fontSize: '14px' }}>Total Amount Payable:
            <span className="money">₹{amount}</span>
          </div>
        </div>

        <div className="content" style={{ backgroundColor: '#fff0', boxShadow: 'none' }}>
          <div className="option">1. Automatic Transfer</div>
          <div className="top">Choose Payment Method</div>

          <div className="upi_content select">
            <img src="/assets/png/paytm.png" alt="Paytm" />
            <div style={{ float: 'right' }}>
              <div className="radio">
                <input
                  id="radio-1"
                  name="paymethod"
                  type="radio"
                  value="Patym"
                  checked={selectedMethod === 'Patym'}
                  onChange={() => setSelectedMethod('Patym')}
                />
                <label htmlFor="radio-1" className="radio-label"></label>
              </div>
            </div>
          </div>

          <div className="upi_content">
            <img src="/assets/png/phonepe.png" alt="PhonePe" />
            <div style={{ float: 'right' }}>
              <div className="radio">
                <input
                  id="radio-2"
                  name="paymethod"
                  type="radio"
                  value="PhonePe"
                  checked={selectedMethod === 'PhonePe'}
                  onChange={() => setSelectedMethod('PhonePe')}
                />
                <label htmlFor="radio-2" className="radio-label"></label>
              </div>
            </div>
          </div>

          <div className="upi_content">
            <img src="/assets/png/upi_b.png" alt="UPI" />
            <div style={{ float: 'right' }}>
              <div className="radio">
                <input
                  id="radio-6"
                  name="paymethod"
                  type="radio"
                  value="UPI"
                  checked={selectedMethod === 'UPI'}
                  onChange={() => setSelectedMethod('UPI')}
                />
                <label htmlFor="radio-6" className="radio-label"></label>
              </div>
            </div>
          </div>

          <div className="upi_content">
            <img src="/assets/png/gopay.png" alt="GooglePay" />
            <div style={{ float: 'right' }}>
              <div className="radio">
                <input
                  id="radio-3"
                  name="paymethod"
                  type="radio"
                  value="GooglePay"
                  checked={selectedMethod === 'GooglePay'}
                  onChange={() => setSelectedMethod('GooglePay')}
                />
                <label htmlFor="radio-3" className="radio-label"></label>
              </div>
            </div>
          </div>

          <input type="hidden" id="rechargeAmount" value={amount} />

          <div className="upi_content">
            <img src="/assets/png/morepay.png" alt="MorePay" />
            <div style={{ float: 'right' }}>
              <div className="radio">
                <b id="lb_qrcode">Note: Please Submit UTR Number After Payment</b>
              </div>
            </div>
            <div id="div_qrcode" style={{ width: '100%', height: '230px', paddingTop: '8px', display: 'block' }}>
              <div style={{ textAlign: 'center', fontSize: '14px', paddingBottom: '5px' }}>Use Mobile Scan Code to Pay</div>
              <div id="qrcode">
                <img
                  id="qrcode_img"
                  style={{
                    height: '213px',
                    marginLeft: '212px',
                    marginTop: '11px',
                    height:'100px',
                  }}
                  src="/assets/png/paymentqr.jpeg"
                  alt="QR Code"
                />
              </div>
            </div>
          </div>

          <div className="option">2. Manual Transfer</div>
          <div className="top">Copy UPI to Payment Software</div>
          <div className="upi_content">
            <span style={{ lineHeight: '30px', fontSize: '14px' }}>UPI: <b id="upi_info">genoxy@ybl</b></span>
            <button className="copy" id="btn_copy" data-clipboard-text="genoxy@ybl" onClick={handleCopy}>Copy</button>
          </div>
          <div className="top">Please enter the UTR No.</div>
          <div className="upi_content" onClick={() => document.getElementById('txt_utr').focus()}>
            <input
              style={{ lineHeight: '30px', height: '100%', fontSize: '22px' }}
              id="txt_utr"
              type="number"
              name="txt_utr"
              placeholder="Input 12-digit UTR"
              maxLength="12"
              value={txtUtr}
              onChange={(e) => setTxtUtr(e.target.value.slice(0, 12))}
            />
          </div>
        </div>
      </div>
      <div className="foot" style={{ boxShadow: 'none' }}>
        <button id="create-bank" onClick={handlePay}>Pay <span className="money">₹{amount}</span></button>
      </div>
    </div>
  );
}
