const KoFiButton = () => {
  const handleClick = () => {
    window.open("https://ko-fi.com/dennif", "_blank");
  };

  return (
    <div className="controls">
        <button onClick={handleClick}>
        Support Me on Ko-fi
        </button>
    </div>
  );
};

export default KoFiButton;