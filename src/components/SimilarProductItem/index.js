// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarityProducts} = props
  const {
    title,
    imageUrl,
    brand,
    totalReviews,
    rating,
    availability,
    price,
    description,
  } = similarityProducts
  return (
    <div>
      <img
        src={imageUrl}
        type="button"
        alt="similar product"
        className="size"
      />
      <h1>{title}</h1>
      <p>by {brand}</p>
      <p>Rs {price}/-</p>
      <button>
        {rating}
        <img
          src="https://assets.ccbp.in/frontend/react-js/star-img.png"
          alt="star"
        />
      </button>
    </div>
  )
}
export default SimilarProductItem
