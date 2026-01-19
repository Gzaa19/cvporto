const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME;

export async function getGithubData() {
    if (!GITHUB_TOKEN || !USERNAME) {
        console.warn("GitHub Token or Username not found in environment variables.");
        return null;
    }

    const query = `
    query($userName:String!) {
      user(login: $userName){
        name
        login
        avatarUrl
        bio
        followers {
          totalCount
        }
        following {
          totalCount
        }
        repositories {
          totalCount
        }
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
  `;

    try {
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: { userName: USERNAME },
            }),
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            console.error("GitHub API Error:", response.statusText);
            return null;
        }

        const json = await response.json();
        if (json.errors) {
            console.error("GitHub GraphQL Errors:", json.errors);
            return null;
        }

        return json.data.user;
    } catch (error) {
        console.error("Failed to fetch GitHub data:", error);
        return null;
    }
}
