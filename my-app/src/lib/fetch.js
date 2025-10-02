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

export const fetchAvatar = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  const { data, error } = await supabase
    .from("profiles")
    .select("avatar")
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message);

  return data.avatar;
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

  if (!userId) {
    return { favourite_societies: [] };
  }

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

export const fetchNetwork = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  const { data, error } = await supabase
    .from("network_interests")
    .select("event_id")
    .eq('user_id', userId);

  if (error) throw new Error(error.message);

  return { user, fetchedNetwork: data };
}

export const fetchEventNetwork = async (eventId) => {
  const { data, error } = await supabase
    .from("network_interests")
    .select("user_id")
    .eq('event_id', eventId);

  if (error) throw new Error(error.message);

  return data;
}

export const deleteNetwork = async (eventId) => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  const { error } = await supabase
    .from('network_interests')
    .delete()
    .eq('user_id', userId)
    .eq('event_id', eventId);

  if (error) throw new Error(error.message);
}

export const updateNetwork = async (eventId) => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  const { error } = await supabase
  .from('network_interests')
  .upsert({ user_id: userId, event_id: eventId }, {
    onConflict: ['user_id', 'event_id']
  });

  if (error) throw new Error(error.message);
}

export const updateHint = async (eventId, hint) => {
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  const { error } = await supabase
  .from('network_interests')
  .upsert({ user_id: userId, event_id: eventId, hint: hint }, {
    onConflict: ['user_id', 'event_id']
  });

  if (error) throw new Error(error.message);
}

export const uploadImage = async ({ e }) => {
  const file = e.target.files[0];
  if (!file) {
    return;
  }

  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    throw new Error("Only JPEG or PNG files are allowed.");
  }

  if (file.size > 3 * 1024 * 1024) {
    throw new Error("File exceeds 3 MB limit.");
  }

  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(`${userId}_${file.name}`, file, { upsert: true });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(`${userId}_${file.name}`);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar: data.publicUrl })
    .eq('id', userId);

  if (updateError) throw new Error(updateError.message);

  return data.publicUrl;
}
