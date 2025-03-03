const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh] bg-gray-900">
      <div className="loader border-8 border-t-8 border-gray-600 border-t-orange-500 rounded-full w-16 h-16 animate-spin"></div>
    </div>
  );
};

export default Loading;
