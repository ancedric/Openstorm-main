import { CircleLoader } from 'react-spinners';

function Loader() {
  return (
    <div className="loader">
      <CircleLoader color="#54129b" />
      <p>Loading...</p>
    </div>
  );
}

export default Loader;