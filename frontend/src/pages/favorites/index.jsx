import { useContext } from "react";
import RecipeItem from "../../components/recipe-item";
import { GlobalContext } from "../../context";

export default function Favorites() {
  const { favoritesList } = useContext(GlobalContext);
  return (
    <section className="py-8 container mx-auto flex flex-wrap justify-center gap-10">
      {favoritesList && favoritesList.length > 0 ? (
        favoritesList.map((item) => (
          <RecipeItem key={favoritesList.indexOf(item)} item={item} />
        ))
      ) : (
        <div className="lg:text-4xl text-xl text-center text-black font-extrabold">
          <p>Nothing is added in favorites.</p>
        </div>
      )}
    </section>
  );
}
