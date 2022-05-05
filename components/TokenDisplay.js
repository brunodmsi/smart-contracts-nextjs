import Image from 'next/image';

const TokenDisplay = ({ amount, logo, name, symbol }) => {
	return (
		<>
		 	<Image src={logo} alt={name} width={100} height={100} />
			{amount} {name} ({symbol}) <br />
		</>
	)
}

export default TokenDisplay;