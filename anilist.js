const query = `
{
	Page {
		activities(userId: 5329808, sort: ID_DESC, type: ANIME_LIST) {
			... on ListActivity {
				siteUrl
				progress
				status
				createdAt
				media {
					id
					title {
						english
						native
					}
					coverImage {
						medium
					}
					description
					siteUrl
				}
			}
		}
	}
}`;
const url = "https://graphql.anilist.co";
const options = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	},
	body: JSON.stringify({ query })
};
fetch("https://graphql.anilist.co", options)
	.then(response => {
		return response.json().then(function (json) {
			return response.ok ? json : Promise.reject(json);
		});
	})
	.then(data => {
		const container = document.querySelector("#anime");
		container.innerHTML = "";
		const activities = data.data.Page.activities;
		let displayedIds = [];
		let count = 0;
		for (let i = 0; i < activities.length && count < 6; i++) {
			const a = activities[i];
			
			if (["plans to watch", "dropped"].includes(a.status) || displayedIds.includes(a.media.id)) {
				continue;
			}

			if (a.status == "rewatched") {
				a.status += " episode";
			}

			const element = document.createElement("div");

			const thumbnailLink = document.createElement("a");
			thumbnailLink.href = a.media.siteUrl;
			thumbnailLink.title = a.media.title.english;
			thumbnailLink.target = "_blank";

			const thumbnail = document.createElement("img");
			thumbnail.src = a.media.coverImage.medium;
			thumbnail.alt = a.media.title.native;
			thumbnailLink.appendChild(thumbnail);

			element.appendChild(thumbnailLink);

			const description = document.createElement("div");
			description.classList.add("description");
			description.innerHTML = `<p><b>${moment(new Date(a.createdAt * 1000)).fromNow()}</b> ${a.status} ${a.progress == null ? "" : `<b>${a.progress}</b> of`} <b><a href="${a.media.siteUrl}" title="${a.media.title.english}" target="_blank">${a.media.title.native}</a></b></p><p><b>Synopsis:</b> ${a.media.description.replaceAll("<br>", "").replaceAll("\n\n", "</p><p>")}</p>`;
			element.appendChild(description);

			container.appendChild(element);

			displayedIds.push(a.media.id);
			count++;
		}
	})
	.catch(error => {
		document.querySelector(".activities").innerHTML = "Failed to load!";
		console.error(error);
	});
