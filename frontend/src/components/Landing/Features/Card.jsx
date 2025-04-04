const Card = ({ image, heading, content }) => {
	return (
		<div className="flex min-w-96 max-w-96 flex-col mr-4">
			<div className="mb-4 flex items-center gap-4">
				<img src={image} alt="Card" className="h-12 w-12" />
				<h4 className="text-xl text-purple">{heading}</h4>
			</div>
			<p className="text-base text-white">{content}</p>
		</div>
	);
};

export default Card;
