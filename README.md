# low mumble

This is a personal blog built with Django, HTMX, Vanilla JavaScript and SQLite. My goal was to create something similar to the blogs offered by [Pika](https://pika.page) but with a more seamless author experience and a tag-based filtering system. Rather than separating admin dashboards from the public-facing blog, the two are integrated and rendered according to logged-in status.

The author experience is pretty simple. When logged in, an admin bar is rendered at the top of the page with two options:
- Create a new post
- Log out

On the main page, all used tags are listed and all posts are listed. Selecting a tag will filter the tag list to only tags associated with the selected tag and filter the post list by the same metric. This view is available to all users. If the author is logged in, a drafts dropdown is also visible where drafts can be viewed.

Selecting a post from the post list navigates the user to the actual blog post. If the author is logged in, there is an edit button at the bottom of the page which will navigate to the edit view.
