const MoodCard = ({ moodScore, label, date }) => {
  const getEmoji = (score) => {
    if (score >= 9) return '🤩';
    if (score >= 7) return '😄';
    if (score >= 5) return '😐';
    if (score >= 3) return '😔';
    return '😭';
  };

  const getColor = (score) => {
    if (score >= 7) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 4) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className={`p-4 rounded-xl border flex items-center gap-4 ${getColor(moodScore)}`}>
      <div className="text-3xl">{getEmoji(moodScore)}</div>
      <div>
        <p className="font-bold text-sm">{label || 'No Label'}</p>
        <p className="text-xs opacity-80">{new Date(date).toLocaleDateString()}</p>
      </div>
      <div className="ml-auto font-bold text-xl">{moodScore}/10</div>
    </div>
  );
};

export default MoodCard;