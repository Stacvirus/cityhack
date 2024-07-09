import { useContext } from "react";
import Hack from "../../components/hack";
import Pagination from "../../components/pagination";
import SearchBar from "../../components/searchbar";
import { GlobalContext } from "../../context";
import Loader from "../../components/loader";

export default function Hackatons() {
  const { searchParam,recipeList, loading } = useContext(GlobalContext);

  if (loading) {
    <Loader />;
  }
  return (
    <div className="p-4">
      <SearchBar />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-[1200px] mx-auto content-center">
        {searchParam == ""
          ? [...recipeList]
              .slice(0, 7)
              .map((item) => (
                <Hack key={recipeList.indexOf(item)} item={item} />
              ))
          : recipeList &&
            recipeList.length > 0 &&
            recipeList.map((item) => (
              <Hack key={recipeList.indexOf(item)} item={item} />
            ))}
        {[...recipeList].slice(0, 7).map((item) => (
          <Hack key={recipeList.indexOf(item)} item={item} />
        ))}
      </div>
      <Pagination />
    </div>
  );
}
