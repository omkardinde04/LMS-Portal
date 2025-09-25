import "../Landingpage/css/FeaturesCard.css"

function FeatureCard(props){
    return(
        <>
            <div className="featurecard">
            <h3 className="featuretitle">{props.name}</h3>
            <img src={props.logo} alt={props.name} />
            <span>{props.desc}</span>
            </div>
        </>
    );
}

export default FeatureCard;