const StarRating = ({ rating, setRating, editable = false }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => editable && setRating(star)}
          className={`text-2xl ${editable ? "cursor-pointer" : ""} ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          } transition-colors`}
        >
          {star <= rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
};
export default StarRating;
