import { useContext } from "react";
import { GlobalContext } from "../../context";
import RecipeItem from "../../components/recipe-item";

export default function Home() {
  const { recipeList, loading } = useContext(GlobalContext);
  if (loading) return <div>Loading... Please wait!</div>;
  return (
    <section className="py-8 container mx-auto flex flex-wrap justify-center gap-10">
      {recipeList && recipeList.length > 0 ? (
        recipeList.map((item) => (
          <RecipeItem key={recipeList.indexOf(item)} item={item} />
        ))
      ) : (
        <div className="lg:text-4xl text-xl text-center text-black font-extrabold">
          <p>Nothing to show. Please search something</p>
        </div>
      )}
    </section>
  );
}
