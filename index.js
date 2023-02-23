import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

// Helper function to decode the authorization header sent by the browser. It
// returns an array with the username and the password.
function decodeAuthorizationHeader(header) {
  const authorizationEncoded = header?.split(" ")?.at(1);

  const authorizationDecoded = Buffer.from(
    authorizationEncoded,
    "base64"
  )?.toString();

  return authorizationDecoded?.split(":");
}

// The root address checks for the authorization header. If it's present, it
// decodes the header, and validates the username and password. If it's valid,
// returns a welcome message. Otherwise, returns an 401 error with the
// WWW-Authenticate header set to "Basic" to trigger the basic authenticatio
// implentation in the browser.
fastify.get("/", async (req, reply) => {
  if (req.headers["authorization"]) {
    const [username, password] = decodeAuthorizationHeader(
      req.headers["authorization"]
    );

    if (username === "username" && password === "password") {
      reply.send({ body: "Welcome!" });
      return;
    }
  }

  reply.code(401).header("WWW-Authenticate", "Basic");
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
