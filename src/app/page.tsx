import HomeClient from "@/components/HomeClient";
import GithubActivity from "@/components/sections/GithubActivity";
import { getHeroStatusData } from "@/lib/data/hero-status";
import { getAboutContentData } from "@/lib/data/about-content";
import { getProjectsData } from "@/lib/data/projects";
import { getSkillsData } from "@/lib/data/skills";

export const dynamic = "force-dynamic";

export default async function Home() {
  const heroStatus = await getHeroStatusData();
  const aboutContent = await getAboutContentData();
  const projects = await getProjectsData();
  const skills = await getSkillsData();

  return (
    <HomeClient heroStatus={heroStatus} aboutContent={aboutContent} projects={projects} skills={skills}>
      <GithubActivity />
    </HomeClient>
  );
}
