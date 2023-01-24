import { createServerAction$ } from "solid-start/server";
import { z } from "zod";
import { addHost } from "../server/twitter";

export default function AddHost() {
  const [adding, { Form }] = createServerAction$(async (form: FormData) => {
    const username = z.string().parse(form.get("username"));
    const host = await addHost(username);
    return host;
  });

  return (
    <div>
      <Form>
        <input type="text" name="username" />
        <button type="submit">Add Host</button>
      </Form>
      {adding.pending && <div>Adding...</div>}
      {adding.error && <div>{adding.error.message}</div>}
      {adding.result && (
        <div>
          <div>
            Added {adding.result.name} (@{adding.result.username})
          </div>
          <div>Twitter ID: {adding.result.id}</div>
        </div>
      )}
    </div>
  );
}
