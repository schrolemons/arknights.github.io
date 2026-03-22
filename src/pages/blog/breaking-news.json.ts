import type {APIContext} from "astro"
import {getCollection} from "astro:content"
import type {BreakingNewsItemProps} from "../../_types/RootPageViews.ts"

/**
 * 该静态文件端点被 ../_views/01-Information.tsx BreakingNewsList 调用
 * The static file endpoint is called by ../_views/01-Information.tsx BreakingNewsList
 *
 * 参考：https://docs.astro.build/zh-cn/guides/endpoints/
 * See: https://docs.astro.build/en/guides/endpoints/
 */
export async function GET({params, request}: APIContext) {
    // TODO:
    const base = import.meta.env.BASE_URL
    const allBlog = await getCollection("blog");

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.getFullYear() + " // " + (date.getMonth() + 1) + " / " + date.getDate();
    };

    const getItemsByCategory = (category: string) => {
        return allBlog
            .filter(item => item.data.category === category)
            .reverse()
            .slice(0, 3)
            .map((item) => ({
                title: item.data.title ?? item.id,
                date: formatDate(item.data.date ?? item.id.substring(0, 9)),
                href: base + "blog/" + item.slug,
                category: item.data.category ?? "未分类"
            })) as BreakingNewsItemProps[];
    };

    return new Response(JSON.stringify([
        {
            name: "最新",
            list: allBlog.reverse().slice(0, 3).map((item) => {
                return {
                    title: item.data.title ?? item.id,
                    date: formatDate(item.data.date ?? item.id.substring(0, 9)),
                    href: base + "blog/" + item.slug,
                    category: item.data.category ?? "未分类"
                }
            }) as BreakingNewsItemProps[]
        },
        {name: "公告", list: getItemsByCategory("公告")},
        {name: "活动", list: getItemsByCategory("活动")},
        {name: "新闻", list: getItemsByCategory("新闻")},
    ]));
}
