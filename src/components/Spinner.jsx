import { CircleLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="relative">
        <CircleLoader color="#83dcb8" />
      </div>
    </div>
  );
};

export default Spinner;
