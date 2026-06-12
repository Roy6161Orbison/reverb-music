import type {StructureResolver} from 'sanity/structure'

// 1ページしか存在しない「シングルトン」ドキュメント
const SINGLETONS = [{id: 'aboutPage', title: 'About Us', schemaType: 'aboutPage'}]

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // 固定ページ（About Us）を専用タブとして上に表示
      ...SINGLETONS.map((singleton) =>
        S.listItem()
          .title(singleton.title)
          .id(singleton.id)
          .child(
            S.document()
              .schemaType(singleton.schemaType)
              .documentId(singleton.id)
              .title(singleton.title),
          ),
      ),
      S.divider(),
      // それ以外（Article / Event）は通常のリスト表示
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETONS.some((s) => s.schemaType === item.getId()),
      ),
    ])
