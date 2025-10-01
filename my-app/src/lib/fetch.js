import { supabase } from './supabase';

export const fetchEvents = async () => {
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      societies (
        name,
        image
      )
    `);

  if (error) throw new Error(error.message);

  return data;
}

export const fetchSocieties = async () => {
  const { data, error } = await supabase
    .from("societies")
    .select("*");

  if (error) throw new Error(error.message);

  console.log(data);

  return data;
}

export const fetchFavourites = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  const { data, error } = await supabase
    .from("profiles")
    .select("favourite_societies")
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export const updateFavourites = async (favourites) => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  const { error } = await supabase
    .from("profiles")
    .update({ favourite_societies: favourites })
    .eq('id', userId);

  if (error) throw new Error(error.message);
}