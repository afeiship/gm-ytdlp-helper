import { useBoolean } from 'ahooks';
import FloatButton from './components/FloatButton';
import CommandPanel from './components/CommandPanel';
import { useSiteCommands } from './hooks/useSiteCommands';

function App() {
  const [isOpen, { setTrue, setFalse }] = useBoolean(false);
  const { currentSite, commands, currentUrl } = useSiteCommands();

  // 未匹配站点时不渲染任何内容
  if (!currentSite) return null;

  return (
    <>
      <FloatButton onClick={setTrue} />
      {isOpen && (
        <CommandPanel
          siteName={currentSite.name}
          commands={commands}
          currentUrl={currentUrl}
          onClose={setFalse}
        />
      )}
    </>
  );
}

export default App;