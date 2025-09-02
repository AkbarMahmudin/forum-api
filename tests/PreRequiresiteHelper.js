/* instanbul ignore file */
const preRequireSiteHelper = async ({ server, username = "Hiiro" }) => {
  // Create User
  const userPayload = {
    username: username,
    password: "secret",
    fullname: "Placeholder Name",
  };

  const responseUser = await server.inject({
    method: "POST",
    url: "/users",
    payload: userPayload,
  });

  const responseAuth = await server.inject({
    method: "POST",
    url: "/authentications",
    payload: userPayload,
  });

  const { accessToken } = JSON.parse(responseAuth.payload).data;
  const { id: userId } = JSON.parse(responseUser.payload).data.addedUser;

	return { accessToken, userId };
};

module.exports = preRequireSiteHelper;
