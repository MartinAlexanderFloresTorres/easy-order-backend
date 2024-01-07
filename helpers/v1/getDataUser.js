const getDataUser = (user) => {
  return {
    _id: user._id,
    name: user.name,
    lastname: user.lastname,
    photo: user.photo,
    country: user.country,
    city: user.city,
    email: user.email,
    phone: user.phone,
    restaurant: user.restaurant,
    subscriptionPlan: user.subscriptionPlan,
  };
};

export default getDataUser;
