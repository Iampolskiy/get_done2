import { createChallenge } from "@/actions/actions";

export default async function createPage() {
  /* const user = await currentUser();
  const userId = user?.id; */
  return (
    <>
      <div>Create New Challenge</div>
      <div>CreateNewClient</div>
      <form action={createChallenge} /* method="post" */>
        <div>
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" />
        </div>

        <div>
          <label htmlFor="category">Category:</label>
          <input type="text" id="category" name="category" />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <input type="text" id="description" name="description" />
        </div>

        <div>
          <label htmlFor="goal">Goal:</label>
          <input type="text" id="goal" name="goal" />
        </div>

        <div>
          <label htmlFor="duration">Duration:</label>
          <input type="date" id="duration" name="duration" />
        </div>

        <div>
          <label htmlFor="difficulty">Difficulty:</label>
          <input type="text" id="difficulty" name="difficulty" />
        </div>

        <div>
          <label htmlFor="age">Age:</label>
          <input type="number" id="age" name="age" />
        </div>

        <div>
          <label htmlFor="age">Progress:</label>
          <input type="number" id="progress" name="progress" />
        </div>

        <div>
          <label htmlFor="gender">Gender:</label>
          <input type="text" id="gender" name="gender" />
        </div>

        <div>
          <label htmlFor="city_address">City Address:</label>
          <input type="text" id="city_address" name="city_address" />
        </div>

        <div>
          <label htmlFor="completed">Completed:</label>
          <input type="radio" value={"true"} id="completed" name="completed" />
        </div>

        {/* <div>
    <label htmlFor="author">Author:</label>
    <input type="text" id="author" name="author" />
  </div> */}

        <div>
          <label htmlFor="age">userid:</label>
          <input type="text" id="userid" name="userid" />
        </div>

        <button type="submit">Create</button>
      </form>
    </>
  );
}

/* 
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // verhindert das automatische Neuladen

    // 2) Formulardaten auslesen
    const formData = new FormData(e.currentTarget);

    // 3) In ein Objekt packen (alle Felder, die du im Formular hast)
    const data = {
      title: formData.get("title"),
      category: formData.get("category"),
      description: formData.get("description"),
      goal: formData.get("goal"),
      duration: formData.get("duration"), // Achtung: Date/Number?
      difficulty: formData.get("difficulty"),
      age: formData.get("age"),
      gender: formData.get("gender"),
      city_address: formData.get("city_address"),
      // Falls du AuthorId oder Ähnliches mitschicken willst:
      // authorId: 81
    };
 */
