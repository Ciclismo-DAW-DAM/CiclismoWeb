import { CircleLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="flex justify-center item ">
      <div className="relative">
        <CircleLoader color="#83dcb8" />
      </div>
    </div>
  );
};

export default Spinner;
