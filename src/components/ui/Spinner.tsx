import { VscLoading } from "react-icons/vsc";

const Spinner = () => {
  return (
    <div className="mx-auto grid h-[80vh] w-full place-content-center">
      <VscLoading className="h-full w-16 animate-spin sm:w-20 lg:w-24" />
    </div>
  );
};
export default Spinner;
