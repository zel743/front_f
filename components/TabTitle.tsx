import { ThemedText } from "./themed-text";
export const TabTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <header style={{ display: "flex", flexDirection: "column", gap: 5, paddingLeft: 20, }}>
     
      <ThemedText type="title" style={{  color: "#6E7577" }}>
        {title}
      </ThemedText>
      <ThemedText type="title">{subtitle}</ThemedText>
    </header>
  );
};
