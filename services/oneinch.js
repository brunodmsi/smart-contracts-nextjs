import axios from 'axios';

const oneInchApi = axios.create({
	baseURL: 'https://api.1inch.io/v4.0/1',
})

export const swap = ({
	fromTokenAddress,	
	toTokenAddress,
	amount,
	fromAddress,
	slippage = 1
}) => {
	return oneInchApi.get('/swap', {
		params: {
			fromTokenAddress,
			toTokenAddress,
			amount,
			fromAddress,
			slippage
		}
	})
}

export default oneInchApi;