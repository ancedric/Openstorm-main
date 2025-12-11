import PropTypes from 'prop-types'

const InfoCard = ({infos}) => {
    
  return (
    <div className="card">
      <figure className='card-fig'>
        <img src={infos.image} alt="features"/>
      </figure>
      <div className="card-body">
        <h2 className="card-title">{infos.title}</h2>
        <p>{infos.desc}</p>
      </div>
    </div>
  )
}

InfoCard.propTypes = {
  infos: PropTypes.shape({
    image:PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired
  }).isRequired,
}

export default InfoCard