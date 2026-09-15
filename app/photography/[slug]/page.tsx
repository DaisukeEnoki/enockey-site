import { notFound } from "next/navigation";
import { getImagesInFolder } from "@/lib/cloudinary";
import { getProject, projects } from "../projects";
import ProjectViewer from "./ProjectViewer";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const images = await getImagesInFolder(project.folder);

  return (
    <ProjectViewer
      title={project.title}
      year={project.year}
      images={images}
      description={project.description}
      url={project.url}
      tags={project.categories}
    />
  );
}
