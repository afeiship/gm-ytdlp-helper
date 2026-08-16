import { GM_log } from '$';
import { useBoolean } from 'ahooks';
import ShowTimeModal from './components/show-time-modal.tsx';
import yxhImg from './assets/images/yxh.gif';

function App() {
  const [isOpen, ctx] = useBoolean();

  GM_log('create 123');

  return (
    <div className="debug-green z3 absolute top-15 right-10 rounded-lg">
      <div className="overflow-hidden rounded-lg bg-blue-100 p-2" onClick={ctx.setTrue}>
        <img src={yxhImg} alt="yxh" />
      </div>
      <ShowTimeModal title="ShowTimeModal" open={isOpen} onCancel={ctx.setFalse} />
    </div>
  );
}

export default App;
