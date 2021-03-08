const fetch = require("node-fetch");
const bluebird = require("bluebird");
fetch.Promise = bluebird;

module.exports = async function (context, req) {
    // context.log('JavaScript HTTP trigger function processed a request.');
    const url = req.body.url;
    var unknown = new URL(url);
    let send = response(context);
    let data;
    try {
        data = await fetch(unknown).then(res => res.json());
        if (Object.keys(data).length) {
            if (data.graphql.shortcode_media.is_video) {
                send(200, data.graphql.shortcode_media.video_url);
            }
            else {
                send(200, data.graphql.shortcode_media.display_url);
            }
        }
        else {
            send(400, "Invalid Url or Account is Private");
        }
    }
    catch (err) {
        context.log(err);
        throw err;
    }
}

function response(context) {
    return function (status, body) {
        context.res = {
            status: status,
            body: body
        };

        context.done();
    };
}