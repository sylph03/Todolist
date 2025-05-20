import React, { useRef } from 'react'
import { Activity, Send } from 'lucide-react'
import moment from 'moment'

const ActivitySection = ({ cardComments=[], onAddCardComment, currentUser }) => {

  const textareaRef = useRef(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const submitComment = (content) => {
    if (!content.trim()) return;

    const commentToAdd = {
      userAvatar: currentUser?.avatar,
      userDisplayName: currentUser?.displayName,
      content: content.trim(),
    }
    
    onAddCardComment(commentToAdd).then(() => {
      if (textareaRef.current) {
        textareaRef.current.value = '';
        textareaRef.current.style.height = "auto";
      }
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitComment(event.target.value);
    }
  };

  const handleSendClick = () => {
    if (textareaRef.current) {
      submitComment(textareaRef.current.value);
    }
  };

  return (
    <>
      <div className="mb-2 flex items-center gap-2">
        <Activity className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <span className="font-semibold text-gray-900 dark:text-gray-100">Hoạt động</span>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <img
          src={currentUser?.avatar || 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg'}
          alt="User Avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2.5 pr-10 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 hover:border-sky-500 dark:hover:border-sky-500 focus:outline-none transition-all duration-200 overflow-hidden"
            placeholder="Viết bình luận..."
            rows={1}
          >
          </textarea>
          <Send onClick={handleSendClick} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-sky-500 cursor-pointer transition-colors duration-200" />
        </div>
      </div>

      <div className="space-y-4">
        {cardComments.map((comment, index) => (
          <div key={index} className="flex items-start gap-3 text-sm">
            <img
            src={comment.userAvatar || 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg'}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-100 dark:ring-sky-900"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900 dark:text-gray-100">{comment.userDisplayName}</span>
              <span className="text-xs text-gray-400">{moment(comment.commentedAt).format('llll')}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-2.5 rounded-lg shadow-sm leading-6 transition-shadow duration-200 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default ActivitySection