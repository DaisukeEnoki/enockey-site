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

  // 端まで来たら隣のプロジェクトへ送るため、写真のあるものだけを順に並べる。
  // 空のプロジェクト（Cloudinary 未アップロード）に飛ぶと行き止まりになるのでスキップする。
  const populated = (
    await Promise.all(
      projects.map(async (p) =>
        p.slug === slug || (await getImagesInFolder(p.folder)).length > 0 ? p : null,
      ),
    )
  ).filter((p): p is NonNullable<typeof p> => p !== null);

  const index = populated.findIndex((p) => p.slug === slug);
  // 末尾で Next / 先頭で Back を押したら反対側へ回り込む（作品を見続けられるように）
  const nextProject = populated[(index + 1) % populated.length];
  const prevProject = populated[(index - 1 + populated.length) % populated.length];

  return (
    <ProjectViewer
      title={project.title}
      year={project.year}
      images={images}
      description={project.description}
      url={project.url}
      tags={project.categories}
      nextSlug={nextProject.slug !== slug ? nextProject.slug : undefined}
      prevSlug={prevProject.slug !== slug ? prevProject.slug : undefined}
    />
  );
}
