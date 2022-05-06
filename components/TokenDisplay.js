import Image from 'next/image';

const TokenDisplay = ({ amount, logo, name, symbol }) => {
	return (
		<div className="flex flex-col justify-center items-center">
		 	<Image 
				src={logo} 
				alt={name} 
				width={100} 
				height={100} 
			/>

			<div className="">
				{amount} {name} ({symbol})
			</div>
		</div>
	)
}

export default TokenDisplay;