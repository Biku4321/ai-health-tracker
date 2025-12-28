const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`}></div>
  );
};

export default Skeleton;