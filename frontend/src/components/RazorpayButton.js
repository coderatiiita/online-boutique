import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

function loadScript(src) {
	return new Promise((resolve) => {
		const script = document.createElement('script')
		script.src = src
		script.onload = () => {
			resolve(true)
		}
		script.onerror = () => {
			resolve(false)
		}
		document.body.appendChild(script)
	})
}

function RazorpayButton(props) {
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  async function displayRazorpay() {
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

		if (!res) {
			alert('Razorpay SDK failed to load. Are you online?')
			return
		}

		const data = props.order

		const options = {
			key: process.env.REACT_APP_RZP_KEY_ID,
			currency: "INR",
			amount: data.totalPrice.toString(10) * 100,
			name: 'Online Boutique',
			description: 'Thank you shopping with us.',
			image: '',
			handler: function (response) {
				props.onSuccess(response.razorpay_payment_id);
			},
      prefill: {
        name: userInfo.name,
				email: userInfo.email
			}
		}
		const paymentObject = new window.Razorpay(options)
		paymentObject.open()
	}
  
  return (
    <button
      type="button"
      className="App-link"
      onClick={displayRazorpay}
    >
      Pay Now
    </button>
	)
}

export default RazorpayButton;