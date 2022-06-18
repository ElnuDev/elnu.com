fetch("https://blog.elnu.com/index.xml")
	.then(response => response.text())
	.then(str => new window.DOMParser().parseFromString(str, "text/xml"))
	.then(data => {
		const container = document.querySelector("#posts");
		const items = data.querySelectorAll("item");
		container.innerHTML = "";
		for (let i = 0; i < Math.min(items.length, 6); i++) {
			const item = items[i];

			const link = item.querySelector("link").innerHTML;
			const title = item.querySelector("title").innerHTML;
			const description = item.querySelector("description").innerHTML;
			const date = new Date(item.querySelector("pubDate").innerHTML);

			const element = document.createElement("div");
			
			if (item.querySelector("enclosure")) {
				const coverUrl = item.querySelector("enclosure").getAttribute("url");
				const thumbnailLink = document.createElement("a");
				thumbnailLink.href = link;
				thumbnailLink.title = title;
			
				const thumbnail = document.createElement("img");
				thumbnail.src = coverUrl;
				thumbnail.alt = title;
				
				thumbnailLink.appendChild(thumbnail);

				element.appendChild(thumbnailLink)
			}
			
			const descriptionDiv = document.createElement("div");
			descriptionDiv.classList.add("description");
			descriptionDiv.innerHTML = `<p><b>${moment(date).fromNow()}</b> posted <a href="${link}"><b><i>${title}</i></b></a></p><p>${description}</p>`;

			element.appendChild(descriptionDiv);

			container.appendChild(element);
		}
	});
