import { Request, Response } from "express";
import request from "request-promise-native";
import cheerio from "cheerio";
import Config from "../config";
import Remarkable from "remarkable";
import toc from "markdown-toc";

export interface IGuideResponse {
    md: string;
    editLink: string;
    html: string;
    toc: string;
}

export const getSotongGuide = ((req: Request, res: Response) => {
    const tocRenderer = new Remarkable().use(toc.plugin());
    const mdRenderer = new Remarkable().use(function(remarkable) {
        remarkable.renderer.rules.heading_open = function(tokens, idx) {
            return "<h" + tokens[idx].hLevel + " id=" + toc.slugify((<any>tokens[idx + 1]).content) + ">";
        };
      });
    request.get(Config.SOTONG_GUIDE_URL)
    .then((data) => {
        const mdPageDom = cheerio.load(data);
        const md = mdPageDom(".markdown-body").html();
        res.send({
            md: md,
            toc: mdRenderer.render(toc(md).content),
            html: mdRenderer.render(md),
            editLink: req.user ? Config.SOTONG_GUIDE_URL : undefined // TODO: make this more secure... somehow
        } as IGuideResponse);
    });
});