import { type ChangeEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { fetchGroups, type Group } from "./GroupList";
import { VideoConvert } from "./VideoConvert";
import type { FileData } from '@ffmpeg/ffmpeg';

interface Props {
  groupId: number;
}

interface PostInput {
  title: string;
  content: string;
  user_id: string;
  group_id: number;
}

/*const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabase.storage
    .from("post-images")
    . upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const { data: publicURLData } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);
    
  const { data, error } = await supabase
    .from("posts")
    .insert({...post, image_url: publicURLData.publicUrl});

  if (error) throw new Error(error.message);

  return data;
}*/

export const CreatePost = (props: Props) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [groupId, setGroupId] = useState<number>(0);
  const [dataGif, setDataGif] = useState<FileData>();
  const [dataImg, setDataImg] = useState<FileData>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: groups } = useQuery<Group[], Error>({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  });

  const { mutate, isPending, isError } = useMutation({ 
    mutationFn: (data: { post:PostInput }) => {
      return createPost(data.post);
    },

    onSuccess: () => {
      navigate("/");
    }
  });

  const setParentUrlGif = (gifData: FileData, imgData: FileData) => {
    setDataGif(gifData);
    setDataImg(imgData);
  }

  const uploadFile = async (imageFile: FileData, extension: string): Promise<string> => {
    const filePath = `${title}-${Date.now()}.${extension}`;
  
    // Currently we only upload GIF and PNG files.
    const typeContent = extension == "gif" ? "image/gif" : "image/png";

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(filePath, imageFile, { contentType: typeContent });
  
    if (uploadError) throw new Error(uploadError.message);
  
    const { data: publicURLData } = supabase.storage
      .from("post-images")
      .getPublicUrl(filePath);

    return publicURLData.publicUrl;
  }

  const createPost = async (post: PostInput) => {
    if (!dataGif || !dataImg)
      throw new Error("There are not files to upload.");
      
    const urlGifFile = await uploadFile(dataGif, "gif");
    const urlImgFile = await uploadFile(dataImg, "png");

    const { data, error } = await supabase
      .from("posts")
      .insert({...post, image_url: urlImgFile, gif_url: urlGifFile});

    if (error) throw new Error(error.message);

    return data;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user)
      throw new Error("You must to be logged in to create a post.");

    if (!dataGif || !dataImg)
      throw new Error("There are not files to upload.");
    
    mutate({ 
      post: { 
        title,
        content,
        user_id: user.id,
        group_id: groupId,
      }
    });
  };

  /*const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
        setSelectedFile(event.target.files[0]);
    }
  };*/

  const handleGroupChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setGroupId(Number(value));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4 text-gray-400">
      <h2 className="text-6xl font-bold mb-6 text-center text-blue-500">
        Create New Post
      </h2>
      <div>
        <label htmlFor="title" className="block mb-2 font-medium"> Title </label>
        <input
          type="text"
          id="title"
          required
          onChange={(event) => setTitle(event.target.value)}
          className="w-full border border-gray/10 bg-transparent p-2 rounded"
        />
      </div>
      <div>
        <label htmlFor="content" className="block mb-2 font-medium"> Content </label>
        <textarea 
          id="content"
          required
          rows={2}
          onChange={(event) => setContent(event.target.value)}
          className="w-full border border-gray/10 bg-transparent p-2 rounded"
        />
      </div>
      <div>
        <label htmlFor="group" className="block mb-2 font-medium"> Select Group</label>
        <select
          id="group"
          required
          defaultValue={props.groupId}
          onChange={handleGroupChange}
          className="w-full border border-gray/10 bg-transparent p-2 rounded">
          <option value={""}> -- Choose a Group -- </option>
          {groups?.map((group, key) => (
            <option key={ key } value={ group.id }>
              { group.name }
            </option>
          ))}
        </select>
      </div>
      {/* <div>
        <label htmlFor="image" className="block mb-2 font-medium"> Upload Image </label>
        <input
          type="file" 
          id="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-gray-400"
        />
        { selectedFile && <img src={URL.createObjectURL(selectedFile)} width="250" />}
      </div> */}
      <div>
        <VideoConvert setParentUrls={setParentUrlGif}/>
      </div>
      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
            { isPending ? "Creating..." : "Create Post" }
        </button>
      </div>
      {isError && <p className="text-red-500"> Error creating post. </p>}
    </form>
  );
};