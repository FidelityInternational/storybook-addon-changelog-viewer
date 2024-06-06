import React, { useMemo } from "react";
import { styled } from "@storybook/theming";
import { UL, LI, A } from "@storybook/components";
import { marked } from "marked";
import { mangle } from "marked-mangle";
import { gfmHeadingId } from "marked-gfm-heading-id";

marked.use(mangle());
marked.use(gfmHeadingId());

const TabWrapper = styled.div`
  background: ${({ theme }) => theme.background.content};
  width: 100%;
  height: 100%;
`;

const TabInner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;

  @media (min-width: 960px) {
    flex-direction: row;
    gap: 5rem;
    padding: 4rem 24px;
  }
`;

const TabAside = styled.aside`
  min-width: 15rem;
  max-width: 21rem;
  order: 1;

  @media (min-width: 960px) {
    order: 2;
  }
`;

const TabToc = styled.div`
  flex-shrink: 0;
  padding: 2rem;
  padding-bottom: 0;

  ul {
    margin-top: 0;
    padding-left: 1rem;
    list-style: none;
  }

  @media (min-width: 960px) {
    position: fixed;
    top: ${({ theme }) => `${theme.layoutMargin}px`};
    bottom: 0;
    margin-top: 6rem;
    margin-bottom: 6rem;
    padding-top: 0;
    padding-right: 20px;
    overflow: auto;
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none;
  }
`;

const TabMain = styled.main`
  padding: 2rem;
  padding-top: 0;
  order: 2;

  @media (min-width: 960px) {
    padding-top: 0;
    padding-right: 0;
    order: 1;
  }
`;

interface TabContentProps {
  markdown: string;
}

function findHeadingsWithSemVer(htmlString: string) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(htmlString, "text/html");
  const headings = dom.querySelectorAll("h1, h2, h3, h4, h5, h6");
  const result = [];

  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    const text = heading.textContent;
    const matches = text.match(/\d+\.\d+\.\d+/);

    if (matches) {
      const id = heading.getAttribute("id");
      const label = text.trim();
      result.push({ id, label });
    }
  }

  return result;
}

export const TabContent: React.FC<TabContentProps> = ({ markdown }) => {
  const html = useMemo(() => marked.parse(markdown), [markdown]);
  const navigationItems = useMemo(() => {
    if (typeof html === "string") {
      return findHeadingsWithSemVer(html);
    }
  }, [html]);

  return (
    <TabWrapper>
      <TabInner>
        <TabMain
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
        <TabAside>
          <TabToc>
            <UL>
              {navigationItems.map(({ label, id }) => (
                <LI key={id}>
                  <A href={`#${id}`}>{label}</A>
                </LI>
              ))}
            </UL>
          </TabToc>
        </TabAside>
      </TabInner>
    </TabWrapper>
  );
};
